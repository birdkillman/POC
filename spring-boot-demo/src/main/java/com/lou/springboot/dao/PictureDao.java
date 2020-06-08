package com.lou.springboot.dao;

import com.lou.springboot.entity.Picture;

import java.util.List;
import java.util.Map;


public interface PictureDao {

    List<Picture> findPictures(Map<String, Object> map);


    int getTotalPictures(Map<String, Object> map);


    int insertPicture(Picture picture);


    int updPicture(Picture picture);


    int delPicture(Integer id);


    Picture findPictureById(Integer id);


    int deleteBatch(Object[] id);
}
