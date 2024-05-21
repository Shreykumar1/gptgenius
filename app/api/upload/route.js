import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'

export async function POST( request) {
  const data = await request.formData()
  const file = data.get('file') 

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes);
  console.log(file);

  // With the file data in the buffer, you can do whatever you want with it.
  // For this, we'll just write it to the filesystem in a new location
  // const path = join('C:/Users/shrey/OneDrive/Desktop/GPT Genius/gptgenius/public','/', 'upload', file.name);
  const path = `C:/Users/shrey/OneDrive/Desktop/GPT Genius/gptgenius/public/upload/${file.name}`
  console.log(path);
  await writeFile(path, buffer)
  console.log(`open ${path} to see the uploaded file`)
  const url = `http://localhost:3000/upload/${file.name}`
  const result = {
    url,
    path,
    name : file.name,
    type : file.type
  }

  return NextResponse.json({ data : result })
}