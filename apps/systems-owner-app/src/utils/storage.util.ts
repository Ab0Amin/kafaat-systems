export const storage = (function () {
  const vault: { [key: string]: any } = {};

  return {
    set: (key: string, value: any) => {
      vault[key] = value;
    },
    get: (key: string) => vault[key],
    remove: (key: string) => {
      delete vault[key];
    },
    log: () => console.log({ vault }),
  };
})();
