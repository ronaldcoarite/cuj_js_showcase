/* global LayoutInflater */

class DescriptionCreator{
    static async getJson(url){
        let httpReqJson = new HttpGet(url);
        let httpRepJson = await httpReqJson.execute();
        let respJson = httpRepJson.getJson();
        return respJson;
    }
}