import { WebContainer } from '@webcontainer/api';

let webContainerInstance = null;
let bootPromise = null;

export const getWebContainer = async () => {
  if (webContainerInstance) {
    return webContainerInstance;
  }

  if (bootPromise) {
    return bootPromise;
  }

  bootPromise = WebContainer.boot().then(container => {
    webContainerInstance = container;
    return container;
  });

  return bootPromise;
};
