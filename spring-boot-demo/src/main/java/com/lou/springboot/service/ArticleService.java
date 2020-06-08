package com.lou.springboot.service;


import com.lou.springboot.entity.Article;
import com.lou.springboot.utils.PageResult;
import com.lou.springboot.utils.PageUtil;

import java.util.List;
import java.util.Map;


public interface ArticleService {

    PageResult getArticlePage(PageUtil pageUtil);

    Article queryObject(Integer id);

    List<Article> queryList(Map<String, Object> map);

    int queryTotal(Map<String, Object> map);

    int save(Article article);

    int update(Article article);

    int delete(Integer id);

    int deleteBatch(Integer[] ids);
}
