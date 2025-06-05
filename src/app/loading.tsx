import { Loader } from "@/_ui/components/Loader";

export default function Loading() {
  // Stack uses React Suspense, which will render this page while user data is being fetched.
  // See: https://nextjs.org/docs/app/api-reference/file-conventions/loading
  return (
    <div className="flex-1 flex items-center justify-center">
      <Loader className="size-16" />
    </div>
  );
}
