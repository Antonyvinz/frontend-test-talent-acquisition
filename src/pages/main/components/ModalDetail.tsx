import { CheckOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { Formik } from "formik";
import * as yup from "yup";

function ModalDetail(props: any) {
    const {
        visible,
        closeModal,
        title,
        dataInit,
        dataPayload,
        loadingState,
        // ,
    } = props;

    const itemPriority = [
        {
            color: "#ED4C5C",
            value: "very-high",
            title: "Very High",
        },
        {
            color: "#F8A541",
            value: "high",
            title: "High",
        },
        {
            color: "#00A790",
            value: "normal",
            title: "Medium",
        },
        {
            color: "#428BC1",
            value: "low",
            title: "Low",
        },
        {
            color: "#8942C1",
            value: "very-low",
            title: "Very Low",
        },
    ];
    return (
        <Formik
            enableReinitialize
            initialValues={{
                activity_group_id: dataInit.activity_group_id,
                priority: dataInit.priority,
                title: dataInit.title,
            }}
            validationSchema={yup.object().shape({
                // title: yup.string().required("Wajib Diisi"),
            })}
            onSubmit={(values) => {
                dataPayload(values);
            }}
        >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, isValid }) => (
                <Modal
                    title={title}
                    className="tambah-list-item"
                    data-cy="tambah-list-item"
                    open={visible}
                    onCancel={closeModal}
                    width={830}
                    footer={[
                        <Button
                            loading={loadingState}
                            disabled={values.title ? false : true}
                            onClick={() => {
                                handleSubmit();
                            }}
                            className={values.title ? "modal-add-save-button" : "button-Disabled"}
                            data-cy="modal-add-save-button"
                        >
                            {loadingState ? "Menyimpan" : "Simpan"}
                        </Button>,
                    ]}
                >
                    <Form layout="vertical">
                        <Form.Item label="NAMA LIST ITEM" validateStatus={errors.title && touched.title ? "error" : ""}>
                            <Input
                                data-cy="modal-add-name-input"
                                placeholder="Tambahkan nama list item"
                                value={values.title}
                                name="title"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onPressEnter={() => {
                                    handleSubmit();
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="PRIORITY" validateStatus={errors.priority && touched.priority ? "error" : ""}>
                            <Select
                                className="modal-add-priority-dropdown"
                                data-cy="modal-add-priority-dropdown"
                                placeholder="Pilih Priority"
                                // defaultValue={0}
                                onChange={(e) => {
                                    setFieldValue("priority", e);
                                }}
                                value={values.priority}
                            >
                                {itemPriority?.map((item: any) => {
                                    return (
                                        <Select.Option value={item?.value} key={item?.value}>
                                            <Row justify="space-between">
                                                <Col>
                                                    <Row align="middle" gutter={20}>
                                                        <Col>
                                                            <div
                                                                style={{
                                                                    height: 12,
                                                                    width: 12,
                                                                    backgroundColor: item.color,
                                                                    borderRadius: 12,
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col>{item?.title}</Col>
                                                    </Row>
                                                </Col>
                                                {item?.value === values.priority ? (
                                                    <Col>
                                                        <CheckOutlined className="select-checked" />
                                                    </Col>
                                                ) : (
                                                    <></>
                                                )}
                                            </Row>
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </Formik>
    );
}

export default ModalDetail;