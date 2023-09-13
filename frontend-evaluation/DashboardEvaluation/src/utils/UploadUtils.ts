import {UploadProps} from "antd";
import EnvironmentManager from "../services/EnvironmentManager";
import {applyFilters} from "../services/HooksManager";
import StringUtils from "./StringUtils";

/**
 * Class util per upload file sfruttando AntD
 */
class UploadUtils {
    static getUploadRequest = (path: string, method = 'POST') => {

        let url = StringUtils.removeRightSlash(EnvironmentManager.getBackEndPath()) + '/' + StringUtils.removeLeftSlash(path)
        let request: UploadProps = {
            action: url,
            headers: {
                'Accept': 'application/json, text/plain, */*',
            },
        };

        /**
         *  URL api da invocare per upload
         *  Stesso hook è presente in api
         *  @hook api_url
         *  @param url:string url da invocare
         *  @param url:Method HTTP method da utilizzare
         *  @param url:CallRequestConfig ulteriori parametri HTTP request
         */
        url = applyFilters("api_request_url", url, method, request);

        /**
         *  Preparo request upload da inviare
         *  Stesso hook è presente in api
         *  @hook api_request
         *  @param url:UploadProps AntD UploadProps props
         *  @param url:string url da invocare
         *  @param url:Method HTTP method da utilizzare
         */
        request = applyFilters("api_request", request, url, method);

        // Ritorno request
        return request
    }
}


export default UploadUtils;