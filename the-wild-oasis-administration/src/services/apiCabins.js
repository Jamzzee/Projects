import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  try {
    const { data, error } = await supabase.from('cabins').select('*');

    if (error) {
      console.log('Cabins could not be loaded');
      throw new Error('Cabins could not be loaded');
    }

    return data;
  } catch (error) {
    console.log(error.message);
  }
}

export async function createEditCabit(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    '/',
    ''
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  try {
    // 1) create/edit cabin
    let query = supabase.from('cabins');

    // A) CREATE
    if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

    // B) EDIT
    if (id)
      query = query
        .update({ ...newCabin, image: imagePath })
        .eq('id', id)
        .select();

    const { data, error } = await query.select().single();

    if (error) {
      console.log(error.message);
      throw new Error('Cabins could not be created');
    }

    // 2) if successfully, upload image
    if (hasImagePath) return data;

    const { error: storageError } = await supabase.storage
      .from('cabin-images')
      .upload(imageName, newCabin.image);

    // 3) delete the cabin If there was an error uploading image
    if (storageError) {
      await supabase.from('cabins').delete().eq('id', data.id);
      console.log(storageError.message);
      throw new Error(
        'Cabin image could not be upload and the cabin was not created'
      );
    }

    return data;
  } catch (error) {
    console.log(error.message);
  }
}

export async function deleteCabin(id) {
  try {
    const { error } = await supabase.from('cabins').delete().eq('id', id);

    if (error) {
      console.log('Cabins could not be delete');
      throw new Error('Cabins could not be delete');
    }
  } catch (error) {
    console.log(error.message);
  }
}
