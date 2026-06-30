import { hydrateStart } from "@tanstack/start-client-core/client";
import { Await, RouterProvider } from "@tanstack/react-router";
import { Suspense } from "react";

let hydrationPromise: Promise<unknown> | undefined;

function StartClient() {
  if (!hydrationPromise)
    hydrationPromise = hydrateStart().then((router: unknown) => {
      window.$_TSR?.h();
      return router;
    });
  return (
    <Suspense fallback={null}>
      <Await promise={hydrationPromise}>
        {(router: unknown) => <RouterProvider router={router as any} />}
      </Await>
    </Suspense>
  );
}

export { StartClient };
