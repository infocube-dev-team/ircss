import {EditOutlined} from "@ant-design/icons";
import {Button, Card, Col, Row} from "antd";
import React, {useContext} from "react";
import {__} from "../../translations/i18n";
import {TabContext} from "../TabContext";
import {User} from "../../models/User";
import Title from "antd/lib/typography/Title";
import DateUtils from "../../utils/DateUtils";
import {applyFilters} from "../../services/HooksManager";
import environmentManager from "../../services/EnvironmentManager";
import {Route} from "react-router-dom";
import {Bread} from "../../services/NavigationManager";

interface Prop {
    entity: User
}

const UserDetails = (props: Prop) => {

    const {entity} = props;
    const key = useContext(TabContext);

    function getHeader() {
        let header = <><Title style={{textAlign: 'center'}}
                        level={2}>{entity.firstName} {entity.lastName}</Title>
            <Title style={{textAlign: 'center'}} level={3}>{entity.login}</Title></>

        return applyFilters("user_detail_header", header, entity)
    }

    function getDetails() {

        let details: {[key: string]:string} = {}
        details[__("users.fields.createdBy")] = entity.createdBy
        details[__("users.fields.createdDate")] = DateUtils.formatDate(entity.createdDate)
        details[__("users.fields.lastModifiedBy")] = entity.lastModifiedBy
        details[__("users.fields.lastModifiedDate")] = DateUtils.formatDate(entity.lastModifiedDate)
        details[__("users.fields.role")] = entity.authorities.map(auth => auth.name).join(', ')

        return <ul> {
            Object.keys(applyFilters("user_detail_details", details, entity))
                .map((key, index) =>
                    <li key={key}><strong>{__(key)}: </strong>{details[key]}</li>
                )}
        </ul>
    }

    return (
        <Row gutter={[24, 24]} justify="center">
            <Col xs={12} xxl={8}>
                <Card className="info-card">
                    <Row gutter={[24, 24]} justify="center">
                        <Col span={24}>
                            {applyFilters("user_detail_before_header", '', entity)}
                            {getHeader()}
                            {applyFilters("user_detail_before_details", '', entity)}
                            {getDetails()}
                            {applyFilters("user_detail_after_details", '', entity)}
                        </Col>
                        <Col span={24} style={{textAlign: 'center'}}>
                            <Button style={{width: '100%', fontSize: 20, height: '50px'}}
                                    onClick={() => key.setActiveKey('edit')} type="primary"
                                    icon={<EditOutlined/>}>{__("common.edit")}</Button>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    )

}

export default UserDetails;
