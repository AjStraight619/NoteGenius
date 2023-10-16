export const fetcher = async (url: RequestInfo | URL, options = {}) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    const error: any = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};
