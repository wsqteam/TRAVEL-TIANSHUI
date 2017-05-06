var http = require("http");
var url = require("url");
var qs = require("querystring");
var fs = require("fs");

http.createServer(function (req , res) {
//��������ͷ
    res.setHeader("Access-Control-Allow-Origin","*");
    if(req.method == "POST"){
        //���շ������û���������
        var result = "";
//��ȡǰ�˴��뷢����·�ɵ�ַ
        var pathName = url.parse(req.url).pathname;
        req.addListener("data",function (chunk) {
            result += chunk;
        });

        req.on("end" , function () {
            var user = qs.parse(result);
            //�ж��û��Ƿ����
            if(user.username){
                fs.readFile("./db.txt" , "utf-8" , function (err,data) {
                    if (!err){
                        console.log("��ȡ�ļ��ɹ�");
                        if (!data){
                            if(pathName == "/login"){
                                res.end("���û�������");
                                return;
                            }
//����ǰ�˷�����·�ɵ�ַ�ж��ǵ�¼����ע��ҳ�棬�����ע��ҳ��
                            if(pathName == "/register"){
//����һ������һ�������������ʺź�����
                                var arr = [];
                                var obj = {};
//���û����ʺ����뱣��
                                obj.username = user.username;
                                obj.password = user.password;
                                arr.push(obj);
//ͬ��д��db.txt�ļ���������ͬ������
                                fs.writeFileSync("./db.txt" , JSON.stringify(arr) , "utf-8");
                                res.end("ע��ɹ�!");
                                return;
                            }
                        }else {
                            console.log("�ļ���������");
//������ת��JSON�����Ա�����ʹ��
                            var arr = JSON.parse(data);
//���������������ݵ����� �жϵ�¼ע��
                            for(var i = 0;i < arr.length;i++){
                                var obj = arr[i];
                                if(obj.username == user.username){
                                    if(pathName == "/login"){
                                        if (obj.password == user.password){
                                            res.end("��¼�ɹ�!");
                                            return;
                                        }else {
                                            res.end("�������");
                                            return;
                                        }
                                    }
                                    if(pathName == "/register"){
                                        res.end("���û��Ѵ���!");
                                        return;
                                    }
                                }
                            }
                            if(pathName == "/login"){
                                res.end("�û���������!");
                                return;
                            }
                            if(pathName == "/regist"){
//�����¶���д������
                                var obj = {};
                                obj.username = user.username;
                                obj.password = user.password;
                                arr.push(obj);
                                fs.writeFileSync("db.txt" , JSON.stringify(arr) , "utf-8");
                                res.end("ע��ɹ�!");
                                return;
                            }
                        }
                    }else {
                        console.log("��ȡ�ļ�ʧ��");
                    }
                })
            }
        });
    }else {
        res.end("get����");
    }
}).listen(3000 , function (err) {
    if (!err){
        console.log("�����������ɹ������ڼ���port3000...");
    }
});