
import { getActor } from './actorManager';
import { loggedCanisterCall } from './callUtils';

/**
 * Greeter function
 * @param name Name to greet
 * @returns Promise resolving to greeting message
 */
export const greet = async (name: string): Promise<string> => {
  return loggedCanisterCall('greet', { name }, async () => {
    return (await getActor()).greet(name);
  });
};
