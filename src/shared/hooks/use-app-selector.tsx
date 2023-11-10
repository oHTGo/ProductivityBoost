import { useSelector } from 'react-redux';
import type { RootState } from '@shared/common/store';
import type { TypedUseSelectorHook } from 'react-redux';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default useAppSelector;
