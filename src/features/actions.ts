'use server';

export async function login(formData: FormData) {
  const values = Object.fromEntries(formData.entries());

  console.log(values);
}
