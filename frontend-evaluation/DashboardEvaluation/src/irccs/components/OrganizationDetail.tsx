import { useContext } from "react";
import { TabContext } from "../../components/TabContext";
import { Button, Card, Col, Row } from "antd";
import Title from "antd/lib/typography/Title";
import { __i } from "../translations/i18n";
import {EditOutlined} from "@ant-design/icons";
import { __ } from "../../translations/i18n";

interface Prop {
    entity: any;
}

const OrganizationDetail = (props: Prop) => {

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
                  <li><strong>{__i('organization.fields.code')}: </strong>{entity.identifier?.[0].value || ''}</li>
                  <li><strong>{__i('organization.fields.address')}: </strong>{entity.address?.[0]?.line[0] || ''}</li>
                  <li><strong>{__i('organization.fields.city')}: </strong>{entity.address?.[0]?.city || ''}</li>
                  <li><strong>{__i('organization.fields.district')}: </strong>{entity.address?.[0]?.district || ''}</li>
                  <li><strong>{__i('organization.fields.country')}: </strong>{entity.address?.[0]?.country || ''}</li>
                  <li><strong>{__i('organization.fields.responsible')}: </strong>{`${entity.contact?.[0]?.name?.given?.[0] || ''} ${entity.contact?.[0]?.name?.family || ''}`}</li>
                </ul>
              </Col>
              {<Col span={24} style={{textAlign: 'center'}}>
                  <Button style={{width: '100%', fontSize: 20, height: '50px'}} onClick={() => key.setActiveKey('edit')} type="primary" icon={<EditOutlined />}>{__("common.edit")}</Button>
              </Col>}
            </Row>
          </Card>
        </Col>
      </Row>
    )

}

export default OrganizationDetail;
