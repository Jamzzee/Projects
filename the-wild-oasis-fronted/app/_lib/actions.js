'use server';

import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { getBooking, getBookings, getCabin } from './data-service';
import { redirect } from 'next/navigation';

// It's all about '/account'

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

export async function updateGuest(formData) {
  // Here we do only back-end. So we need to be sure about two things:
  // - user which invoke this action need to be autorized;
  // - we need to treat all the inputs are 'UNSAVE'

  const session = await auth();
  if (!session) throw new Error('You must be loggen in');

  const nationalID = formData.get('nationalID');
  const [nationality, countryFlag] = formData.get('nationality').split('%');

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error('Please provide a valid national ID');

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId);

  if (error) throw new Error('Guest could not be updated');

  revalidatePath('/account/profile');
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error('You must be log in');

  // Prevent for deleting bookings which not belong to login user.
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map(booking => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error('You are not allowed to delete this booking');

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) throw new Error('Booking could not be deleted');

  revalidatePath('account/reservation');
}

export async function updateReservation(formData) {
  // if (!formData) throw new Error('Form data is required');

  // 1. Check authentication and authorization
  const session = await auth();
  if (!session) throw new Error('You must be log in');

  const bookingId = formData.get('reservationId');
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map(booking => String(booking.id));
  if (!guestBookingIds.includes(bookingId))
    throw new Error('Your are not allowed to update this booking');

  // 2. Get form data and update reservation
  const observations = formData.get('observations').slice(0, 1000); // Max 1000 characters
  const numGuests = formData.get('numGuests');

  const updatedFields = { numGuests, observations };
  const { error } = await supabase
    .from('bookings')
    .update(updatedFields)
    .eq('id', bookingId);

  if (error) {
    throw new Error(`Reservation could not be updated: ${error.message}`);
  }

  // 3. Revalidate cache and redirect to the reservation page
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  redirect('/account/reservations');

  return {
    success: true,
    message: 'Reservation successfully updated',
  };
}

// '/cabins/[id]' - reservation form and so on

export async function createBooking(bookingData, formData) {
  // console.log(bookingData, formData);
  const session = await auth();
  if (!session) throw new Error('You must be log in');

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: 'unconfirmed',
  };

  const { _, error } = await supabase.from('bookings').insert([newBooking]);

  if (error) throw new Error('Booking could not be created');

  revalidatePath(`/cabins/${bookingData.cabindId}`);
  redirect('/cabins/thankyou');
}
