import { useContext } from "react";
import { AdminDashboardContext } from "../../App";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register custom font
Font.register({
  family: "smallFont",
  src: "/FontFaces/EbGaramond/EBGaramond-Medium.ttf", // Path is relative to the public folder
});

Font.register({
  family: "mediumFont",
  src: "/FontFaces/EbGaramond/EBGaramond-SemiBold.ttf",
});

Font.register({
  family: "bigFont",
  src: "/FontFaces/cheltenham/cheltenham-cond-normal-700.ttf",
});

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  section: { marginBottom: 10 },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: "bigFont",
  },
  subtitle: {
    marginBottom: 10,
    fontFamily: "mediumFont",
  },
  text: { marginBottom: 5, fontFamily: "smallFont" },
  boldText: { fontFamily: "mediumFont" },
});

const ReportTemp = ({ reportSelected }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{reportSelected?.type} Report</Text>
        <View style={styles.section}>
          <Text style={styles.subtitle}>Report Id: {reportSelected?._id}</Text>
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
          <Text style={styles.boldText}>Reporter ID:</Text>
          <Text style={styles.text}>{reportSelected?.reporter?._id}</Text>
          <Text style={styles.boldText}>Reporter Name:</Text>
          <Text style={styles.text}>{reportSelected?.reporter?.name}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.boldText}>Reason:</Text>
          <Text style={styles.text}>{reportSelected?.reason}</Text>
          <Text style={styles.boldText}>Content:</Text>
          <Text style={styles.text}>{reportSelected?.description}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReportTemp;
