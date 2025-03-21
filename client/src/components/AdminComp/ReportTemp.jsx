import { useContext } from "react";
import { AdminDashboardContext } from "../../App";
import { Document, Page, Text, View, Font, Image } from "@react-pdf/renderer";

// Register custom font
Font.register({
  family: "smallFont",
  src: "/FontFaces/EbGaramond/EBGaramond-Regular.ttf", // Path is relative to the public folder
});

Font.register({
  family: "mediumFont",
  src: "/FontFaces/EbGaramond/EBGaramond-SemiBold.ttf",
});

Font.register({
  family: "bigFont",
  src: "/FontFaces/cheltenham/cheltenham-cond-normal-700.ttf",
});

const ReportTemp = ({ reportSelected }) => {
  return (
    <>
      {/* <Document>
        <Page
          size="A4"
          style={{
            backgroundColor: "red",
          }}
        >
          <Text style={styles.title}>{reportSelected?.type} Report</Text>
          <View style={styles.section}>
            <Text style={styles.subtitle}>
              Report Id: {reportSelected?._id}
            </Text>
            <Text style={styles.subtitle}>
              Report Post: {reportSelected?.post}
            </Text>
            {reportSelected?.comment && (
              <Text style={styles.subtitle}>
                Report Comment: {reportSelected?.comment}
              </Text>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Reporter Id:</Text>{" "}
              {reportSelected?.reporter?._id}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Reporter Name:</Text>{" "}
              {reportSelected?.reporter?.name}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.boldText}>Reason:</Text>
            <Text style={styles.text}>{reportSelected?.reason}</Text>
            <Text style={styles.boldText}>Content:</Text>
            <Text style={styles.text}>{reportSelected?.description}</Text>
          </View>
        </Page>
      </Document> */}

      <Document>
        <Page
          size="A4"
          style={{
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Image
              src="/Logo/ChroniqueBlack2.png"
              style={{ width: 40, height: 40 }}
            />
          </View>
          <View>
            
          </View>
        </Page>
      </Document>
    </>
  );
};

export default ReportTemp;
