export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log('Дані успішно отримано:', body)

  return {
    success: true,
    message: 'Subscription successfully created!',
    data: body
  }
})
