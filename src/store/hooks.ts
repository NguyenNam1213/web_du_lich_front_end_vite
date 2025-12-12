// src/store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Hook để dispatch actions với type-safe
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook để select state với type-safe
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;