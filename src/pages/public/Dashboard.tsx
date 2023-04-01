import { DeleteFilled } from "@ant-design/icons";
import { Row, Col, Button, Card } from "antd";
import { AppHeader } from "../../config/Util";

function DashboardPage() {
    return (
        <div className="dashboard-App">
            <AppHeader />
            <div>
                <Row>
                    <Col>
                        <div>Activity</div>
                    </Col>
                    <Col>
                        <Button className="button-Add">+ Tambah</Button>
                    </Col>
                </Row>
            </div>
            <div>
                <Card>
                    <div>New Activity</div>

                    <div>
                        <Row justify="space-between">
                            <Col>02 April 2023</Col>
                            <Col>
                                <Button className="button-Add">
                                    <DeleteFilled />
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default DashboardPage;
