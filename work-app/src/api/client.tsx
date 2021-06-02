const createWorkLog = async (url: RequestInfo, payload: RequestInit) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (e) {
    console.log(e);
    return {};
  }
};

export { createWorkLog };
