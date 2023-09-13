import {Component} from "react";
import {Button, Col, Row, Spin, Table, TablePaginationConfig} from "antd";
import {ColumnsType} from "antd/lib/table";
import DataProvider from "../providers/DataProvider";
import {__} from "../translations/i18n";
import {Content} from "antd/lib/layout/layout";
import {FileExcelOutlined} from "@ant-design/icons";
import {applyFilters} from "../services/HooksManager";
import EnvironmentManager from "../services/EnvironmentManager";
import InfiniteScroll from 'react-infinite-scroll-component';

export type DWColumn = {
    column: string,
    render?: any
}

interface Props {
    columns: ColumnsType<any>;
    data?: any;
    provider: DataProvider;
    onMapData?: (data: any) => any;
    params?: any;
    showButton?: boolean;
    module: any;
    isInfiniteScrollOn?: () => boolean;
    hasMore?: () => boolean;
}

interface State {
    dataSource: any;
    total: number;
    offset: number;
    defaultPageSize: number;
    loadingExport: boolean;
    loadingTableData: boolean;
    defaultParams: any;
    hasMore:boolean;
}

export default class DataTable extends Component<Props, State> {

    state: State = {
        dataSource: null,
        hasMore: true,
        total: 0,
        defaultPageSize: 10,
        offset: 0,
        loadingExport: false,
        loadingTableData: false,
        defaultParams: null
    }

    async componentDidMount() {
        /**
         * Ritorna i default params per la ricerca
         * @hook search_form_data_default_params_${this.props.getModuleKey()}
         * @param params:{}
         */
        const defaultParams = applyFilters(`search_form_data_default_params_` + this.props.module.getModuleKey(), this.props.params);
        this.setState({defaultParams});
        // this.props.params = defaultParams;

        // Caricamento dati ricerca se presenti filtri in Local Storage
        /* const storage = EnvironmentManager.getStorage();
        const storedData = await storage.load(`search_form_data_${this.props.module.getModuleKey()}`);
        if (storedData) {
            await this.reloadData(this.state.defaultPageSize, this.state.offset, storedData);
            return;
        } */

        await this.reloadData(this.state.defaultPageSize, this.state.offset, defaultParams);
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.params !== this.props.params) {
            this.reloadData(this.state.defaultPageSize, this.state.offset, this.props.params).then(() => {
            });
        }
    }

    /**
     * Metodo per la gestione della paginazione
     * @param page:number Pagina corrente
     * @param pageSize:number Grandezza pagina
     */
    pagination = async (page: number, pageSize: number) => {
        await this.reloadData(pageSize, (page - 1) * pageSize, this.props.params, false);
    }

    /**
     * Metodo per la gestione del next in caso di infinite scroll
     * @param next:any next load
     */
    next = async () => {
        const {defaultPageSize, dataSource} = this.state;
        await this.reloadData(defaultPageSize, dataSource ? dataSource.length : 0, this.props.params, false, true);
    }

    reloadData = async (pageSize: number, offset: number, params: {
        [key: string]: string
    }, needCount = false, append = false) => {
        this.setState({loadingTableData: true});
        const {dataSource, defaultParams} = this.state;
        const req = {
            params: Object.assign({}, defaultParams, params)
        };

        const count = !needCount ? {value: this.state.total} : await this.props.provider.getCount(pageSize, offset, req);
        let response;
        if (this.props.module.needFilters) {
            response = await this.props.provider.getList(pageSize, offset, req, this.props.module.getModuleKeyWithFilters());
        } else {
            response = await this.props.provider.getList(pageSize, offset, req, this.props.module.getModuleKey());
        }
        let newDataSource = await this.props.onMapData?.(response) ?? response;
        newDataSource = (append ? dataSource.concat(newDataSource) : newDataSource)
        this.setState({
            dataSource: newDataSource,
            hasMore: this.props.hasMore?.() ?? false,
            total: count.value,
            defaultPageSize: pageSize,
            offset: offset,
            loadingTableData: false
        })
    }


    export = async () => {
        /**
         * Ritorna i default params per l'export della tabella
         * @hook export_form_data_default_params_${this.props.module.getModuleKey()}
         * @param params: {}
         */
        const defaultParams = applyFilters(`export_form_data_default_params_` + this.props.module.getModuleKey(), this.props.params);

        if (!this.props.params && defaultParams) {
            await this.exportList(defaultParams);
        } else {
            await this.exportList(this.props.params);
        }
    }

    exportList = async (params: { [key: string]: string }) => {
        this.setState({loadingExport: true});
        const req = {
            params: Object.assign({}, params),
            timeout: 3000000,
            responseType: "arraybuffer"
        };
        await this.props.provider.export(req);
        this.setState({loadingExport: false});
    }

    /**
     * Metodo per la visualizzazione dei totali
     * @param total:number Totale elementi
     * @returns descrizione Totale elementi
     */
    total = (total: number) => {
        return __('common.table.total', {total: total})
    }

    /**
     * Metodo per la gestione del sorting
     * @param pagination Paginazione attuale
     * @param filters Filtri se presenti
     * @param sorter Sorting tabella
     */
    handleSorting = (pagination: any, filters: any, sorter: any) => {
        const offset = (pagination.current - 1) * pagination.pageSize;
        const limit = pagination.pageSize;
        let params = {};

        if (sorter.hasOwnProperty("column") && sorter.column !== undefined) {
            const sorterString = `${sorter.columnKey},${sorter.order === "ascend" ? 'asc' : 'desc'}`;
            params = {
                sort: sorterString,
                orderBy: sorter.columnKey
            };
            this.reloadData(limit, offset, params);
        } else {
            this.pagination(pagination.current, pagination.pageSize);
        }
    };

    table() {

        const {columns, data, showButton, isInfiniteScrollOn} = this.props;
        const {dataSource, total, defaultPageSize, loadingExport, loadingTableData} = this.state;

        const pagination: false|TablePaginationConfig = isInfiniteScrollOn ? false : {
            defaultPageSize: defaultPageSize,
            showSizeChanger: true,
            pageSizeOptions: [defaultPageSize.toString(), '50', '100', '150'],
            position: ["bottomCenter", "topCenter"],
            total: total,
            showQuickJumper: true,
            showTotal: this.total,
            onChange: this.pagination,
            onShowSizeChange: this.pagination
        }

        return <Table dataSource={dataSource ?? data} columns={columns}
               onChange={this.handleSorting}
               pagination={pagination} loading={loadingTableData}/>
    }

    render() {

        const {columns, data, showButton, isInfiniteScrollOn} = this.props;
        const {dataSource, total, defaultPageSize, loadingExport, loadingTableData, hasMore} = this.state;
        const length = dataSource ? dataSource.length : data ? data.length : defaultPageSize
        const infiniteScroll = isInfiniteScrollOn?.() ?? false

        return <div>
            {showButton && (
                <Content style={{marginTop: 20}}>
                    <Row gutter={[24, 24]} justify="end">
                        <Col span={2}>
                            <Spin spinning={loadingExport} delay={500}>
                                <Button onClick={() => this.export()} className="exp" type="primary"
                                        icon={<FileExcelOutlined/>}
                                        block>{__('common.table.export').toUpperCase()}</Button>
                            </Spin>
                        </Col>
                    </Row>
                </Content>)}
            {!dataSource && !data && (<div id={"loader-container"} className="loader-container"
                                           style={{
                                               display: "flex",
                                               justifyContent: "center",
                                               alignItems: "center",
                                               height: "30vh"
                                           }}><Spin/></div>)}

            {((dataSource || data) && !infiniteScroll) && (this.table())}

            {((dataSource || data) && infiniteScroll) && (

                <InfiniteScroll
                    dataLength={length} //This is important field to render the next data
                    next={this.next}
                    hasMore={hasMore}
                    loader={<h4 style={{textAlign: "center"}}>Loading...</h4>}
                    style={{marginBottom: 40}}
                    endMessage={
                        <p style={{textAlign: "center"}}>
                            <b>{__('common.noMoreData')}</b>
                        </p>
                    }
                > {this.table()} </InfiniteScroll>

            )}
        </div>

    }
}

