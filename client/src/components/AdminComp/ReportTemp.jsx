import { Document, Page, Text, View, Font, Image } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import moment from 'moment';

// Register custom font
Font.register({
  family: 'smallFont',
  src: '/FontFaces/EbGaramond/EBGaramond-Regular.ttf', // Path is relative to the public folder
});

Font.register({
  family: 'mediumFont',
  src: '/FontFaces/EbGaramond/EBGaramond-SemiBold.ttf',
});

Font.register({
  family: 'bigFont',
  src: '/FontFaces/cheltenham/cheltenham-cond-normal-700.ttf',
});

const ReportTemp = ({ reportSelected }) => {
  return (
    <>
      <Document>
        <Page
          size='A4'
          style={{
            position: 'relative',
            paddingHorizontal: 30,
            paddingVertical: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}>
          {/* Chronique logo */}
          <View
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <Image src='/Logo/ChroniqueBlack2.png' style={{ width: 35, height: 35 }} />
          </View>

          {/* Page title */}
          <View>
            <Text style={{ fontSize: 24, fontFamily: 'bigFont', textTransform: 'capitalize' }}>
              {reportSelected?.type} Report
            </Text>
          </View>

          {/* report ref */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontFamily: 'smallFont',
              fontSize: 12,
              width: '50%',
            }}>
            <Text
              style={{
                backgroundColor: 'rgba(193, 193, 193, 0.5)',
                paddingHorizontal: 10,
              }}>
              report id : {reportSelected?._id}
            </Text>
            <Text
              style={{
                backgroundColor: 'rgba(193, 193, 193, 0.5)',
                paddingHorizontal: 10,
              }}>
              report post : {reportSelected?.post}
            </Text>
            {reportSelected?.comment && (
              <Text
                style={{
                  backgroundColor: 'rgba(193, 193, 193, 0.5)',
                  paddingHorizontal: 10,
                }}>
                report comment : {reportSelected?.comment}
              </Text>
            )}
          </View>

          {/* reporter info */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              borderLeftWidth: 1,
              borderLeftColor: '#c1c1c1',
              borderLeftStyle: 'solid',
              paddingLeft: 12,
              fontFamily: 'smallFont',
              fontSize: 12,
            }}>
            <Text>
              <Text style={{ fontFamily: 'mediumFont' }}>Reporter id :</Text>{' '}
              {reportSelected?.reporter?._id}
            </Text>
            <Text>
              <Text style={{ fontFamily: 'mediumFont' }}>Reporter name :</Text>{' '}
              {reportSelected?.reporter?.name}
            </Text>
          </View>

          {/* Report details */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              borderLeftWidth: 1,
              borderLeftColor: '#c1c1c1',
              borderLeftStyle: 'solid',
              paddingLeft: 12,
              fontFamily: 'smallFont',
              fontSize: 12,
            }}>
            <Text>
              <Text style={{ fontFamily: 'mediumFont' }}>Reason :</Text> {reportSelected?.reason}
            </Text>
            <Text>
              <Text style={{ fontFamily: 'mediumFont' }}>Content :</Text>{' '}
              {reportSelected?.description}
            </Text>
          </View>

          {/* Report footer */}
          <View
            style={{
              position: 'absolute',
              bottom: 20,
              right: 30,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              fontFamily: 'smallFont',
              fontSize: 12,
            }}>
            <Text>Chronique - {moment().format('DD/MM/YYYY')}</Text>
          </View>
        </Page>
      </Document>
    </>
  );
};

ReportTemp.propTypes = {
  reportSelected: PropTypes.object.isRequired,
};

export default ReportTemp;
