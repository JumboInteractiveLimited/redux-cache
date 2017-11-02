export interface State {
    DEFAULT_KEY?: number | null | undefined;
    [x: string]: any;
}
export declare type AccessStrategy = (state: State, reducerKey: string, cacheKey: string) => number | null | undefined;
export declare type GetState = () => State;
export declare type Args = {
    cacheKey?: string;
    accessStrategy?: AccessStrategy;
};
export declare const checkCacheValid: (getState: GetState, reducerKey: string, args?: Args) => boolean;
export default checkCacheValid;
