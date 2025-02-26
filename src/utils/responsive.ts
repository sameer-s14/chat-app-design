import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 393;
const guidelineBaseHeight = 800;

const ws = (size: any) => (width / guidelineBaseWidth) * size;
const hs = (size: any) => (height / guidelineBaseHeight) * size;
// moderateScale

const ms = (size: any, factor = 0.5) => size + (ws(size) - size) * factor;

export { ws, hs, ms, width, height };