
export const addDelay = async (isFromCache: boolean): Promise<void> => {
  const minDelay = isFromCache ? 50 : 200;
  const maxDelay = isFromCache ? 150 : 600;
  const delay = Math.floor(Math.random() * (maxDelay - minDelay) + minDelay);
  
  return new Promise(resolve => setTimeout(resolve, delay));
};
