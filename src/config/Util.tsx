import { Button, Image, Modal } from "antd";
import iconAlert from "../assets/icons/icon-alert.svg";
import iconInformation from "../assets/icons/icon-modal-information.svg";

export const AppHeader = () => {
    return (
        <div className="header-Background" data-cy="header-Background">
            <div className="header-title" data-cy="header-title">
                TO DO LIST APP
            </div>
        </div>
    );
};

export const ModalDelete = (props: any) => {
    const { loadingState, visible, closeModal, functConfirm, title, name } = props;
    return (
        <Modal
            className="modal-delete"
            data-cy="modal-delete"
            open={visible}
            onCancel={closeModal}
            // closable={false}
            footer={[
                <Button onClick={closeModal} className="modal-delete-cancel-button" data-cy="modal-delete-cancel-button">
                    Batal
                </Button>,
                <Button loading={loadingState} onClick={functConfirm} className="modal-delete-confirm-button" data-cy="modal-delete-confirm-button">
                    {loadingState ? "Menghapus" : "Hapus"}
                </Button>,
            ]}
        >
            <div className="modal-header">
                <Image className="icon-delete" src={iconAlert} preview={false} />
            </div>
            <div className="modal-delete-title" data-cy="modal-delete-title">
                Apakah anda yakin menghapus {title} <span className="modal-delete-title-accent">"{name}"?</span>
            </div>
        </Modal>
    );
};

export const ModalInformation = (props: any) => {
    const { visible, closeModal, title } = props;
    return (
        <Modal className="modal-information" data-cy="modal-information" open={visible} footer={null} onCancel={closeModal} centered={true}>
            <div className="modal-information-title">
                <Image className="modal-information-icon" src={iconInformation} preview={false} />
                {title}
            </div>
        </Modal>
    );
};
