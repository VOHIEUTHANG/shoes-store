const express = require("express");
import brandService from "../service/brand.service";
class brandController {
  async updateBrand(req, res) {
    let brandList = req.body;
    let listUpdate = [];
    for (let element of brandList) {
      listUpdate.push(
        brandService.update(element.id, element.brandName, element.popular)
      );
    }
    Promise.all(listUpdate)
      .then(() => {
            res.status(200).json({
            title: 'Thông báo',
            message: 'Sửa thành công!',
         });
      })
      .catch(err => {
            console.log('🚀 ~ file: brand.controller.js ~ method update ~ brandController ~ error', err);
            res.status(500).json({
            title: 'Thông báo',
            message: 'Sửa thất bại!',
         });
      });
  }
}

export default new brandController();
