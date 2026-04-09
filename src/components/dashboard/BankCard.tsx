import React from 'react';
import { View, StyleSheet, Image, Platform, useWindowDimensions } from 'react-native';
import { Typography } from '@components/common/Typography';
import { COLORS } from '@theme/index';
import { formatCurrency } from '@utils/formatters';

interface BankCardProps {
  cardType?: string;
  cardNumber?: string;
  expiryDate?: string;
  balance?: string | number;
  cardHolder?: string;
}

export const BankCard = ({
  cardType = "Prepaid card",
  cardNumber = "7093",
  expiryDate = "08/27",
  balance = 3048.00,
  cardHolder = "Emmanuel Israel",
}: BankCardProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - 133;
  const formattedBalance = formatCurrency(balance);
  const parts = formattedBalance.split('.');
  const wholePart = parts[0] || formattedBalance;
  const centsPart = parts[1] || '00';

  return (
    <View style={[styles.shadowContainer, { width: cardWidth }]}>
      <View style={styles.cardContainer}>
        <Image 
          source={require('@assets/creditcard.png')} 
          style={StyleSheet.absoluteFillObject} 
          resizeMode="cover" 
        />
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Image 
              source={require('@assets/chip.png')} 
              style={styles.chip}
              resizeMode="contain"
            />
            <Typography variant="body" color={COLORS.surface} style={styles.cardType}>
              {cardType}
            </Typography>
            <Image 
              source={require('@assets/Visa_logo_white.png')} 
              style={styles.visaLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.leftCol}>
              <Typography variant="h3" color={COLORS.surface} weight="normal" style={styles.cardNumber}>
                •••• {cardNumber}
              </Typography>
              <View style={styles.expiryGroup}>
                <Typography variant="caption" color={COLORS.surface} weight="bold" style={styles.validThruLabel}>
                  VALID{"\n"}THRU
                </Typography>
                <Typography variant="caption" color={COLORS.surface} weight="normal" style={styles.dateText}>
                  {expiryDate}
                </Typography>
              </View>
            </View>

            <View style={styles.rightCol}>
              <Typography variant="h3" color={COLORS.surface} weight="medium" style={styles.balanceText} numberOfLines={1} adjustsFontSizeToFit>
                {wholePart}
                <Typography variant="caption" color={COLORS.surface} weight="normal" style={styles.centsText}>
                  .{centsPart}
                </Typography>
              </Typography>
              <Typography variant="caption" color={COLORS.surface} weight="normal" style={styles.nameText} numberOfLines={1}>
                {cardHolder}
              </Typography>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    marginVertical: 15,
    marginRight: 15,
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      }
    })
  },
  cardContainer: {
    width: '100%',
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#C56223',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    width: 36,
    height: 26,
  },
  cardType: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 10,
    opacity: 0.95,
  },
  visaLogo: {
    marginLeft: 'auto',
    width: 52,
    height: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
    paddingRight: 8,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  expiryGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validThruLabel: {
    fontSize: 6,
    lineHeight: 7,
    fontWeight: '600',
    opacity: 0.9,
    marginRight: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '400',
  },
  rightCol: {
    alignItems: 'flex-end',
    flexShrink: 1,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 6,
  },
  centsText: {
    fontSize: 12,
    fontWeight: '400',
  },
  nameText: {
    fontSize: 11,
    fontWeight: '400',
    opacity: 0.9,
  },
});