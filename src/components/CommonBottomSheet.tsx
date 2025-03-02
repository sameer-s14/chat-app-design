import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { useCallback } from 'react';
import { ms } from '../utils';

function CommonBottomSheet({ bottomSheetRef, closeBottomSheet, snapPoints = ['30%'], handleSheetChanges, children, displayIndicator = false }: any) {
    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1} // Hide backdrop when sheet is closed
                appearsOnIndex={0} // Show backdrop when sheet is open
                opacity={0.7} // Customize the backdrop opacity
            />
        ),
        [],
    );

    return <BottomSheet
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges || useCallback(index => { }, [])}
        snapPoints={snapPoints}
        index={-1}
        handleIndicatorStyle={[styles.indiStyle, { display: !displayIndicator ? "none" : "flex" }]}
        enablePanDownToClose={true}
        enableHandlePanningGesture={true}
        onClose={closeBottomSheet}
        backgroundStyle={styles.bottomSheetBackground}
    >
        <BottomSheetView style={styles.contentContainer}>
            {children}
        </BottomSheetView>
    </BottomSheet>
}

const styles = StyleSheet.create({
    indiStyle: {
        backgroundColor: COLORS.DARK_SLATE_GRAY,
        width: ms(60),
        height: ms(4),
    },
    bottomSheetBackground: {
        backgroundColor: COLORS.WHITE
    },
    contentContainer: {
        height: '100%',
    },

})
export default CommonBottomSheet;