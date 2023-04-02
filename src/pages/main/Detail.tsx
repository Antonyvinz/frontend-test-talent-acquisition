import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Dropdown, Image, Input, MenuProps, Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosRepository from "../../config/Axios";
import itemEmptyVector from "../../assets/images/todo-empty-state.svg";
import iconEdit from "../../assets/icons/icon-edit.svg";

const items: MenuProps["items"] = [
    {
        // icon: <></>,
        label: <a href="https://www.antgroup.com">1st menu item</a>,
        key: "0",
    },
    {
        label: <a href="https://www.aliyun.com">2nd menu item</a>,
        key: "1",
    },
    {
        type: "divider",
    },
    {
        label: "3rd menu item",
        key: "3",
    },
];

function DetailPage() {
    const navigate = useNavigate();
    const { activityID } = useParams();
    const [contentLoading, setContentLoading] = useState(false);
    const [listItem, setListItem] = useState([] as any);
    const [data, setData] = useState({} as any);
    const [modalCreateVisible, setModalCreateVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getData = () => {
        setContentLoading(true);
        axiosRepository.getActivityDetail(activityID).then((res) => {
            console.log(res);
            setData(res?.data);
            setListItem(res?.data?.todo_items);
            setContentLoading(false);
        });
    };

    const createToDo = () => {
        console.log("create");
    };

    return (
        <div className="item-list">
            <div className="todo-title-bar">
                <Row justify="space-between">
                    <Col>
                        <Row>
                            <Col>
                                <Button
                                    className="todo-nav-button"
                                    onClick={() => {
                                        navigate("/");
                                    }}
                                >
                                    <LeftOutlined />
                                </Button>
                            </Col>
                            <Col>
                                {editMode ? (
                                    <Input />
                                ) : (
                                    <div className="todo-title" data-cy="todo-title">
                                        {data?.title}
                                    </div>
                                )}
                            </Col>
                            <Col>
                                <Button
                                    className="todo-edit-button"
                                    onClick={() => {
                                        setEditMode(!editMode);
                                    }}
                                >
                                    <Image src={iconEdit} preview={false} />
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                {/* <Dropdown
                                    menu={{ items }}
                                    // trigger={["click"]}
                                >
                                    Sort
                                </Dropdown> */}
                            </Col>
                            <Col>
                                <Button
                                    onClick={() => {
                                        setModalCreateVisible(true);
                                    }}
                                    className="activity-add-button"
                                    data-cy="activity-add-button"
                                    icon={<PlusOutlined />}
                                >
                                    Tambah
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            {listItem.length === 0 ? (
                <div className="todo-empty-state" data-cy="todo-empty-state">
                    <Button onClick={() => setModalCreateVisible(true)} type="link">
                        <Image src={itemEmptyVector} preview={false} />
                    </Button>
                </div>
            ) : (
                <div>List</div>
            )}
        </div>
    );
}

export default DetailPage;
