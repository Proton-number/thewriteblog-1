import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: "dtbj3t1s",
  dataset: "production",
  apiVersion: "2023-09-01", // Specify the API version
  useCdn: true, // Set to `true` to use the CDN
});

export default sanityClient;
