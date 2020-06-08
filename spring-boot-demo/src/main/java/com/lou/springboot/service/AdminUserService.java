package com.lou.springboot.service;

import com.lou.springboot.entity.AdminUser;
import com.lou.springboot.utils.PageResult;
import com.lou.springboot.utils.PageUtil;

public interface AdminUserService {


    PageResult getAdminUserPage(PageUtil pageUtil);

    AdminUser updateTokenAndLogin(String userName, String password);

    AdminUser selectById(Long id);

    AdminUser selectByUserName(String userName);

    int save(AdminUser user);


    int updatePassword(AdminUser user);

    int deleteBatch(Integer[] ids);


    AdminUser getAdminUserByToken(String userToken);
}
