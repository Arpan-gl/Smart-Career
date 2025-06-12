import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className='w-full h-auto flex justify-center items-center p-2'>
      <SignIn />
    </div>
  )
}