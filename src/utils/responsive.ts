import { Dimensions } from 'react-native';

export const { width, height } = Dimensions.get('window');

export const guidelineBaseWidth = 393;
export const guidelineBaseHeight = 800;

export const ws = (size: any) => (width / guidelineBaseWidth) * size;
export const hs = (size: any) => (height / guidelineBaseHeight) * size;
// moderateScale

export const ms = (size: any, factor = 0.5) => size + (ws(size) - size) * factor;

export const HEADER_HEIGHT = 60;
export const STATUS_ITEM_SIZE = 68;
export const CHAT_AVATAR_SIZE = 50;
