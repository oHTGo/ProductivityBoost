import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@shared/common/store';

const useAppDispatch: () => AppDispatch = useDispatch;
export default useAppDispatch;
