package com.budgetbuddy.mapper;

import com.budgetbuddy.dto.UserDTO;
import com.budgetbuddy.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-07T10:23:33+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDTO toDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO.UserDTOBuilder userDTO = UserDTO.builder();

        userDTO.createdAt( user.getCreatedAt() );
        userDTO.currency( user.getCurrency() );
        userDTO.email( user.getEmail() );
        userDTO.fullName( user.getFullName() );
        userDTO.id( user.getId() );

        return userDTO.build();
    }

    @Override
    public User toEntity(UserDTO userDTO) {
        if ( userDTO == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.currency( userDTO.getCurrency() );
        user.email( userDTO.getEmail() );
        user.fullName( userDTO.getFullName() );

        return user.build();
    }
}
