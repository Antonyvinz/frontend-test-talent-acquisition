import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Image, List, Row } from "antd";
import dashboardVector from "../../assets/images/dashboard-vector.png";
import { useEffect, useState } from "react";
import moment from "moment";
import axiosRepository from "../../config/Axios";

function DashboardPage() {
    const [modalVisible, setModalVisible] = useState(false);
    const [listActivity, setListActivity] = useState([] as any);

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getData = () => {
        axiosRepository.getActivityGroups().then((res) => {
            console.log(res);
            setListActivity(res?.data?.data);
        });
    };
    const createActivity = () => {
        setModalVisible(true);
        axiosRepository.postActivityGroups({
            email: "antonyvinz@gmail.com",
            title: "New Activity",
        });
        getData();
    };

    const deleteActivity = (id: any) => {
        axiosRepository.deleteActivityGroups(id);
        getData();
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
                        <Button onClick={createActivity} className="activity-add-button" icon={<PlusOutlined />}>
                            Tambah
                        </Button>
                    </Col>
                </Row>
            </div>
            {listActivity.length === 0 ? (
                <div className="activity-empty-state">
                    <Row justify="center" gutter={50}>
                        <Col>
                            <Image className="activity-empty-vector" src={dashboardVector} preview={false} />
                        </Col>
                        <Col>
                            <div className="activity-empty-button">
                                <Button onClick={createActivity} shape="circle">
                                    <PlusOutlined />
                                </Button>
                            </div>
                            <div className="activity-empty-title">Buat activty pertamamu</div>
                        </Col>
                    </Row>
                </div>
            ) : (
                <div>
                    <List
                        grid={{ gutter: 20, column: 4 }}
                        dataSource={listActivity}
                        renderItem={(item: any) => (
                            <List.Item>
                                <Card className="activity-item" key={item?.id}>
                                    <div className="activity-item-title">{item?.title}</div>
                                    <div className="activity-item-extra">
                                        <Row justify="space-between" align="middle">
                                            <Col>
                                                <div className="activity-item-date">{moment(item?.created_at).format("DD MMMM YYYY")}</div>
                                            </Col>
                                            <Col>
                                                <Button className="activity-item-delete-button" onClick={() => deleteActivity(item?.id)}>
                                                    <DeleteFilled />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </div>
    );
}

export default DashboardPage;
