/* **********************************************/
/*                 FETCH && JSON                */
/* **********************************************/
export async function GetJSONdata(url){
    try {
        let result = await fetch(url);
        let data = await result.json();
        return (data);
    }
    catch (err) {
        console.error(err);
        return (null);
    }
}
/************************************************/