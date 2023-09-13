import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import { useContext } from "react";
import { __ } from "../../translations/i18n";
import { TabContext } from "../TabContext";
import Title from "antd/lib/typography/Title";
import { Role } from "../../models/Role";
import StingUtils from "../../utils/StringUtils";

interface Prop {
    entity: Role
}

const RoleDetails = (props: Prop) => {

    const {entity} = props;
    const key = useContext(TabContext);

    return (
      <Row gutter={[24, 24]} justify="center">
        <Col xs={12} xxl={8}>
          <Card className="info-card">
            <Row gutter={[24, 24]} justify="center">
              <Col span={24}>
                <Title style={{textAlign: 'center'}} level={2}>{entity.name}</Title>
                <ul>
                  {
                    entity.capabilities.map(cap => <li>{StingUtils.capitalizeEachWord(cap.name.replace('_', ' '))}</li>)
                  }
                </ul>
              </Col>
              <Col span={24} style={{textAlign: 'center'}}>
                  <Button style={{width: '100%', fontSize: 20, height: '50px'}} onClick={() => key.setActiveKey('edit')} type="primary" icon={<EditOutlined />}>{__("common.edit")}</Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    )

}

export default RoleDetails;
