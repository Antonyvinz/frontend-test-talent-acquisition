import { CheckOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Dropdown, Image, Input, Menu, Row, Skeleton } from "antd";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import iconAscending from "../../assets/icons/icon-ascending.svg";
import iconDelete from "../../assets/icons/icon-delete.svg";
import iconDescending from "../../assets/icons/icon-descending.svg";
import iconEdit from "../../assets/icons/icon-edit.svg";
import iconLatest from "../../assets/icons/icon-latest.svg";
import iconOldest from "../../assets/icons/icon-oldest.svg";
import iconUnfinished from "../../assets/icons/icon-unfinished.svg";
import todoSortButton from "../../assets/icons/todo-sort-button.svg";
import itemEmptyVector from "../../assets/images/todo-empty-state.svg";
import axiosRepository from "../../config/Axios";
import { ModalInformation, ModalDelete } from "../../config/Util";
import ModalDetail from "./components/ModalDetail";

function DetailPage() {
    const navigate = useNavigate();
    const { activityID } = useParams();
    const [listItem, setListItem] = useState([] as any);
    const [data, setData] = useState({} as any);
    const [dataInit, setDataInit] = useState({} as any);
    const [editId, setEditId] = useState(0);
    const [modalCreateVisible, setModalCreateVisible] = useState(false);
    const [modalEditVisible, setModalEditVisible] = useState(false);
    const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
    const [modalAlertVisible, setModalAlertVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [deleteName, setDeleteName] = useState("");
    const [contentLoading, setContentLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [sortIndex, setSortIndex] = useState("1");

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getData = () => {
        setContentLoading(true);
        axiosRepository.getActivityDetail(activityID).then((res) => {
            console.log(res.data);
            setData(res?.data);
            setListItem(res?.data?.todo_items);
            setContentLoading(false);
            setButtonLoading(false);
            closeModal();
        });
    };
    const openCreateModal = () => {
        console.log(dataInit);
        setDataInit({
            activity_group_id: activityID?.toString(),
        });
        setModalCreateVisible(true);
    };
    const openAlert = () => {
        setModalAlertVisible(true);
    };
    const closeAlert = () => {
        setModalAlertVisible(false);
    };
    const closeModal = () => {
        setModalCreateVisible(false);
        setModalEditVisible(false);
        setModalDeleteVisible(false);
    };

    const createToDo = (value: any) => {
        console.log(value);
        axiosRepository.postToDoItem(value).then(() => {
            setButtonLoading(true);
            getData();
        });
    };

    const deleteToDo = async () => {
        setButtonLoading(true);
        await axiosRepository.deleteToDoItem(deleteId).then(async () => {
            getData();
        });
        openAlert();
    };
    const patchTitle = (value: any) => {
        console.log(value);
        // setEditMode(false);
        axiosRepository.patchActivityGroups(value, activityID).then(() => {
            getData();
            setEditMode(false);
        });
    };
    const checkItem = (value: any, item: any) => {
        // console.log(value, id);
        let payload = {
            is_active: value === true ? 0 : 1,
            priority: item?.priority,
        };
        console.log(payload);
        axiosRepository.patchToDoItem(payload, item?.id).then(() => {
            getData();
        });
    };
    const editToDo = (value: any) => {
        let payload = {
            is_active: value?.is_active,
            priority: value?.priority,
            title: value?.title,
        };
        axiosRepository.patchToDoItem(payload, editId).then(() => {
            getData();
        });
    };

    const sortMethod = [
        {
            key: "1",
            icon: iconLatest,
            title: "Terbaru",
            funct: () => {
                setSortIndex("1");
                setListItem(listItem.sort((a: any, b: any) => b.id - a.id));
                console.log(listItem);
            },
        },
        {
            key: "2",
            icon: iconOldest,
            title: "Terlama",
            funct: () => {
                setSortIndex("2");
                setListItem(listItem.sort((a: any, b: any) => a.id - b.id));
                console.log(listItem);
            },
        },
        {
            key: "3",
            icon: iconAscending,
            title: "A-Z",
            funct: () => {
                setSortIndex("3");
                setListItem(listItem.sort((a: any, b: any) => a.title.localeCompare(b.title)));
            },
        },
        {
            key: "4",
            icon: iconDescending,
            title: "Z-A",
            funct: () => {
                setSortIndex("4");
                setListItem(listItem.sort((a: any, b: any) => b.title.localeCompare(a.title)));
                console.log(listItem);
            },
        },
        {
            key: "5",
            icon: iconUnfinished,
            title: "Belum Selesai",
            funct: () => {
                setSortIndex("5");
                setListItem(listItem.sort((a: any, b: any) => b.is_active - a.is_active));
                console.log(listItem);
            },
        },
    ];

    const priorityColor = (value: any) => {
        if (value === "very-high") {
            return "#ED4C5C";
        } else if (value === "high") {
            return "#F8A541";
        } else if (value === "normal") {
            return "#00A790";
        } else if (value === "low") {
            return "#428BC1";
        } else if (value === "very-low") {
            return "#8942C1";
        }
    };

    return (
        <div className="item-list">
            <div className="todo-title-bar">
                <Row justify="space-between">
                    <Col>
                        <Row align="middle">
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
                                    <Formik
                                        enableReinitialize
                                        initialValues={{
                                            title: data?.title,
                                        }}
                                        validationSchema={yup.object().shape({
                                            // name: yup.string().required("Required"),
                                        })}
                                        onSubmit={(
                                            values
                                            // , { resetForm }
                                        ) => {
                                            patchTitle(values);
                                        }}
                                    >
                                        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, isValid }) => (
                                            <Input
                                                className="todo-input-title"
                                                // value={data?.title}
                                                // value={toDoTitle}
                                                value={values.title}
                                                name="title"
                                                bordered={false}
                                                onChange={handleChange}
                                                onBlur={() => handleSubmit()}
                                                onPressEnter={() => handleSubmit()}
                                            />
                                        )}
                                    </Formik>
                                ) : (
                                    <div
                                        className="todo-title"
                                        data-cy="todo-title"
                                        onClick={() => {
                                            setEditMode(!editMode);
                                        }}
                                    >
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
                        <Row gutter={10}>
                            <Col>
                                <Dropdown
                                    className="todo-Sort"
                                    data-cy="todo-sort-button"
                                    overlay={
                                        <Menu defaultSelectedKeys={[sortIndex]} selectedKeys={[sortIndex]}>
                                            {sortMethod?.map((item: any) => {
                                                return (
                                                    <Menu.Item key={item?.key} onClick={item?.funct} className="sort-selection" data-cy="sort-selection">
                                                        <Row justify="space-between">
                                                            <Col>
                                                                <Row gutter={15}>
                                                                    <Col>
                                                                        <Image src={item?.icon} preview={false} />
                                                                    </Col>
                                                                    <Col>{item.title}</Col>
                                                                </Row>
                                                            </Col>
                                                            {item?.key === sortIndex ? (
                                                                <Col>
                                                                    <CheckOutlined />
                                                                </Col>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </Row>
                                                    </Menu.Item>
                                                );
                                            })}
                                        </Menu>
                                    }
                                >
                                    <Image src={todoSortButton} preview={false} />
                                </Dropdown>
                            </Col>
                            <Col>
                                <Button
                                    onClick={() => {
                                        openCreateModal();
                                    }}
                                    className="todo-add-button"
                                    data-cy="todo-add-button"
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
                    <Button onClick={() => openCreateModal()} type="link">
                        <Image src={itemEmptyVector} preview={false} />
                    </Button>
                </div>
            ) : (
                <div>
                    {listItem.map((item: any, index: any) => {
                        return (
                            <>
                                {contentLoading ? (
                                    <Skeleton.Input className="todo-item-skeleton" active />
                                ) : (
                                    <div key={item.id} className="todo-item">
                                        <Row justify="space-between">
                                            <Col>
                                                <Row gutter={20} align="middle">
                                                    <Col>
                                                        <Checkbox
                                                            className="todo-item-checkbox"
                                                            data-cy="todo-item-checkbox"
                                                            onChange={(e: any) => {
                                                                // console.log(e.target?.checked);
                                                                checkItem(e.target.checked, item);
                                                            }}
                                                            value={item.is_active === 0 ? true : false}
                                                            checked={item.is_active === 0 ? true : false}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <div
                                                            style={{
                                                                height: 12,
                                                                width: 12,
                                                                backgroundColor: priorityColor(item.priority),
                                                                borderRadius: 12,
                                                            }}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <div className="todo-item-title" data-cy="todo-item-title" style={{ textDecoration: item.is_active === 0 ? "line-through" : "none" }}>
                                                            {item.title}
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <Button
                                                            className="item-ghost-button"
                                                            onClick={() => {
                                                                // setEditMode(!editMode);
                                                                setModalEditVisible(true);
                                                                setDataInit(item);
                                                                setEditId(item.id);
                                                            }}
                                                        >
                                                            <Image src={iconEdit} preview={false} />
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col>
                                                <Button
                                                    className="todo-item-delete-button"
                                                    data-cy="todo-item-delete-button"
                                                    onClick={() => {
                                                        setModalDeleteVisible(true);
                                                        setDeleteId(item?.id);
                                                        setDeleteName(item?.title);
                                                    }}
                                                >
                                                    <Image className="icon-delete" src={iconDelete} preview={false} />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </>
                        );
                    })}
                </div>
            )}
            {modalCreateVisible && (
                <ModalDetail visible={modalCreateVisible} closeModal={closeModal} title="Tambah List Item" dataInit={dataInit} dataPayload={(e: any) => createToDo(e)} loadingState={buttonLoading} />
            )}
            {modalEditVisible && (
                <ModalDetail visible={modalEditVisible} closeModal={closeModal} title="Edit Item" dataInit={dataInit} dataPayload={(e: any) => editToDo(e)} loadingState={buttonLoading} />
            )}
            <ModalDelete title="activty" name={deleteName} closeModal={closeModal} visible={modalDeleteVisible} loadingState={buttonLoading} functConfirm={deleteToDo} />

            <ModalInformation title="Item berhasil dihapus" closeModal={closeAlert} visible={modalAlertVisible} />
        </div>
    );
}

export default DetailPage;
