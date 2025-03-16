import { useEffect, useState, useMemo } from "react";
import { Calendar, Modal, Row, Col, Card, Divider } from "antd";
import { getCalendarData } from "../../apiService";
import moment from "moment";

export function CalendarComponent(refetchCalendarData, setRefetchCalendarData) {
  const [data, setData] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getCalendarData()
      .then((response) => {
        console.log("response: ", response);
        setData(response);
      })
      .catch(console.error);
  }, [refetchCalendarData]);

  const dataMap = useMemo(
    () =>
      Array.isArray(data) && data.length > 0
        ? data.reduce((acc, item) => ({ ...acc, [item.date]: item }), {})
        : {},
    [data]
  );

  const dateCellRender = (date) => {
    const dateString = date.format("YYYY-MM-DD");
    const cellData = dataMap[dateString];
    return cellData ? (
      <div
        style={{
          backgroundColor: "#1890ff",
          color: "white",
          padding: "2px 5px",
          borderRadius: 3,
          fontSize: "0.8em",
          margin: 2,
        }}
      >
        {cellData.totalAppointments} Appointments
      </div>
    ) : null;
  };

  const handleDateSelect = (date) => {
    const dateString = date.format("YYYY-MM-DD");
    const cellData = dataMap[dateString];
    if (cellData) {
      setSelectedDate(dateString);
      setSelectedAppointments(cellData.appointments);
      setIsModalOpen(true);
    }
  };

  // Disable dates older than 2 months
  const disabledDate = (current) => {
    return current && current < moment().subtract(2, "months").endOf("day");
  };

  // Sort appointments
  const sortedAppointments = selectedAppointments.sort((a, b) => {
    const now = moment();
    const aTime = moment(a.appointmentTime, "HH:mm");
    const bTime = moment(b.appointmentTime, "HH:mm");

    // Check if appointment is today and at the current time
    if (aTime.isSame(now, "minute")) return -1; // Place the current time appointment at the top
    if (bTime.isSame(now, "minute")) return 1; // Ensure we place the current time appointment first if both are equal

    // Otherwise, sort by upcoming appointments
    return aTime.isBefore(bTime) ? -1 : 1;
  });

  // Get the first 3 appointments after sorting
  const displayedAppointments = sortedAppointments.slice(0, 3);

  return (
    <>
      <Calendar
        dateCellRender={dateCellRender}
        onSelect={handleDateSelect}
        disabledDate={disabledDate}
      />

      <Modal
        title={`Appointments on ${selectedDate}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600} // Adjust modal width for better readability
        style={{ top: 20 }}
      >
        <div style={{ padding: 20 }}>
          {displayedAppointments.length > 0 ? (
            displayedAppointments.map((appointment, index) => (
              <Card
                key={index}
                style={{ marginBottom: 20 }}
                title={`Patient: ${appointment.patientName}`}
                bordered={false}
                headStyle={{
                  backgroundColor: "#1677ff", // Accent color
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <p>
                      <strong>Time:</strong> {appointment.appointmentTime}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>Age:</strong> {appointment.patientAge}
                    </p>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <p>
                      <strong>Contact:</strong> {appointment.contactNumber}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>Appointment Date:</strong>{" "}
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </p>
                  </Col>
                </Row>
              </Card>
            ))
          ) : (
            <p>No appointments found for this date.</p>
          )}

          {/* Show message if there are more than 3 appointments */}
          {selectedAppointments.length > 3 && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <p style={{ fontWeight: "bold", color: "#1677ff" }}>
                There are more appointments than displayed here. Please use the
                list view to review all appointments.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
