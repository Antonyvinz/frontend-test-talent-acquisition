import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Image, List, Row, Skeleton } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import iconDelete from "../../assets/icons/icon-delete.svg";
import activityEmptyVector from "../../assets/images/activity-empty-state.svg";
import axiosRepository from "../../config/Axios";
import { ModalInformation, ModalDelete } from "../../config/Util";

function DashboardPage() {
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [listActivity, setListActivity] = useState([] as any);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [contentLoading, setContentLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [deleteName, setDeleteName] = useState("");

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getData = () => {
        setContentLoading(true);
        axiosRepository.getActivityGroups().then((res) => {
            console.log(res);
            setListActivity(res?.data?.data);
            setButtonLoading(false);
            closeModal();
            setContentLoading(false);
        });
    };
    const createActivity = async () => {
        setContentLoading(true);
        axiosRepository
            .postActivityGroups({
                email: "antonyvinz@gmail.com",
                title: "New Activity",
            })
            .then(() => {
                getData();
            });
    };
    const openModal = () => {
        setModalVisible(true);
    };
    const closeModal = () => {
        setModalVisible(false);
    };
    const openAlert = () => {
        setAlertVisible(true);
    };
    const closeAlert = () => {
        setAlertVisible(false);
    };

    const openDetail = (id: any) => {
        navigate("/activity-detail/" + id);
    };

    const deleteActivity = async () => {
        setButtonLoading(true);
        await axiosRepository.deleteActivityGroups(deleteId).then(async () => {
            getData();
        });
        openAlert();
    };
    return (
        <div className="dashboard" data-cy="dashboard">
            <div className="activity-title-bar">
                <Row justify="space-between">
                    <Col>
                        <div className="activity-title" data-cy="activity-title">
                            Activity
                        </div>
                    </Col>
                    <Col>
                        <Button onClick={createActivity} className="activity-add-button" data-cy="activity-add-button" icon={<PlusOutlined />}>
                            Tambah
                        </Button>
                    </Col>
                </Row>
            </div>
            {listActivity.length === 0 ? (
                <div className="activity-empty-state">
                    <Button onClick={createActivity} type="link">
                        <Image src={activityEmptyVector} preview={false} />
                    </Button>
                </div>
            ) : (
                <div>
                    <List
                        grid={{ gutter: 20, column: 4 }}
                        dataSource={listActivity}
                        renderItem={(item: any) => (
                            <>
                                {contentLoading ? (
                                    <Skeleton.Input className="activity-card-skeleton" active />
                                ) : (
                                    <List.Item>
                                        <div className="activity-item" data-cy="activity-item" key={item?.id}>
                                            <div className="activity-item-title" data-cy="activity-item-title" onClick={() => openDetail(item?.id)}>
                                                {item?.title}
                                            </div>
                                            <div className="activity-item-footer">
                                                <Row justify="space-between" align="middle">
                                                    <Col>
                                                        <div className="activity-item-date" data-cy="activity-item-date">
                                                            {moment(item?.created_at).format("DD MMMM YYYY")}
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <Button
                                                            className="activity-item-delete-button"
                                                            data-cy="activity-item-delete-button"
                                                            onClick={() => {
                                                                openModal();
                                                                setDeleteId(item?.id);
                                                                setDeleteName(item?.title);
                                                            }}
                                                        >
                                                            <Image className="icon-delete" src={iconDelete} preview={false} />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            </>
                        )}
                    />
                </div>
            )}
            <ModalDelete data-cy="modal-delete" title="activty" name={deleteName} closeModal={closeModal} visible={modalVisible} loadingState={buttonLoading} functConfirm={deleteActivity} />
            <ModalInformation data-cy="modal-information" title="Activity berhasil dihapus" closeModal={closeAlert} visible={alertVisible} />
        </div>
    );
}

export default DashboardPage;
