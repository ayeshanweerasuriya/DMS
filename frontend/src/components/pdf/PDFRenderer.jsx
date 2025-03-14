import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    
    justifyContent: "space-between",
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#2b6cb0",
    paddingBottom: 15,
  },
  clinicInfo: {
    fontSize: 10,
    color: "#4a5568",
    lineHeight: 1.5,
  },
  invoiceMeta: {
    textAlign: "right",
    fontSize: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2b6cb0",
    marginBottom: 8,
  },
  twoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  table: {
    width: "100%",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingVertical: 8,
  },
  tableHeader: {
    width: "70%",
    paddingLeft: 12,
    fontWeight: "bold",
    fontSize: 10,
    color: "#4a5568",
  },
  tableHeaderAmount: {
    width: "30%",
    paddingRight: 12,
    fontWeight: "bold",
    fontSize: 10,
    color: "#4a5568",
    textAlign: "right",
  },
  tableCell: {
    width: "70%",
    paddingLeft: 12,
    fontSize: 10,
  },
  tableCellAmount: {
    width: "30%",
    paddingRight: 12,
    fontSize: 10,
    textAlign: "right",
  },
  totalSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f7fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#718096",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
  content: {
    fontSize: 12,
  },
});

export function PDFInvoice({ record }) {
  const invoiceDate = new Date(record.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  console.log("record: ", record);

  const treatments = [
    { name: "Comprehensive Dental Examination Fee", amount: record.treatmentFee || "-" },
    { name: "Prescription Medication Fee", amount: record.medicationFee || "-" }
  ];

  const subtotal = treatments.reduce((total, item) => total + item.amount, 0);
  const tax = subtotal * 0.05; // 5% GST
  const totalAmount = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#2b6cb0",
                marginBottom: 4,
              }}
            >
              DentalEase Center
            </Text>
            <View style={styles.clinicInfo}>
              <Text>22 Dental Health Boulevard</Text>
              <Text>Colombo - 400001, Sri Lanka</Text>
              <Text>Phone: +94 77 9876 5432</Text>
              <Text>GSTIN: 27ABCDE1234F1Z5</Text>
              <Text>www.dentalease.lk</Text>
            </View>
          </View>

          <View style={styles.invoiceMeta}>
            <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 4 }}>
              INVOICE
            </Text>
            <Text>Invoice #: DC2025-0211</Text>
            <Text>Date: {invoiceDate}</Text>
            <Text>Due Date: 28 Feb 2025</Text>
          </View>
        </View>

        {/* Patient and Doctor Info */}
        <View style={styles.twoColumn}>
          <View>
            <Text style={styles.sectionTitle}>ATTENDING DENTIST:</Text>
            <Text style={styles.content}>Dr. Melani Rifai, MDS</Text>
            <Text style={styles.content}>License: MH123456</Text>
            <Text style={styles.content}>Specialization: Oral Surgery</Text>
          </View>
        </View>

        {/* Services Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SERVICE DETAILS</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>DESCRIPTION</Text>
              <Text style={styles.tableHeaderAmount}>AMOUNT (Rs. )</Text>
            </View>

            {/* Table Rows */}
            {treatments.map((treatment, index) => (
            <View style={styles.tableRow} key={index}>
                <Text style={styles.tableCell}>{treatment.name}</Text>
                <Text style={styles.tableCellAmount}>{treatment.amount.toString()}</Text>  {/* Ensure it's a string */}
            </View>
            ))}
          </View>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.tableCell}>Subtotal:</Text>
            <Text style={styles.tableCellAmount}>
              Rs. {subtotal ? subtotal.toLocaleString("en-US") : "0.00"}
            </Text>
          </View>
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.tableCell}>GST (5%):</Text>
            <Text style={styles.tableCellAmount}>
              Rs.{" "}
              {tax
                ? tax.toLocaleString("en-US", { maximumFractionDigits: 2 })
                : "0.00"}
            </Text>
          </View>
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
              Total Due:
            </Text>
            <Text style={[styles.tableCellAmount, { fontWeight: "bold" }]}>
              Rs.{" "}
              {totalAmount
                ? totalAmount.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })
                : "0.00"}
            </Text>
          </View>
        </View>

        {/* Payment Instructions */}
        <View style={{ marginTop: 20, fontSize: 10 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
            PAYMENT INSTRUCTIONS:
          </Text>
          <Text>• Make cheques payable to Elite Dental Care Center</Text>
          <Text>• Bank Transfer: HDFC Bank A/C 12345678901</Text>
          <Text>• IFSC: HDFC0000123</Text>
          <Text>• Credit/Debit Cards Accepted</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for choosing DentalEase Center!</Text>
          <Text>
            Services subject to terms & conditions • All taxes included • E&OE
          </Text>
          <Text>
            For queries: accounts@dentalEase.lk • +94 77 9876 5432 (Accounts
            Dept.)
          </Text>
        </View>
      </Page>
    </Document>
  );
}
