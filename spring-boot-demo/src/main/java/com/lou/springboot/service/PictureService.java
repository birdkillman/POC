package com.lou.springboot.service;


import com.lou.springboot.entity.Picture;
import com.lou.springboot.utils.PageResult;
import com.lou.springboot.utils.PageUtil;


public interface PictureService {

    PageResult getPicturePage(PageUtil pageUtil);


    Picture queryObject(Integer id);

    int save(Picture picture);


    int update(Picture picture);

    int delete(Integer id);

    int deleteBatch(Integer[] ids);
}
