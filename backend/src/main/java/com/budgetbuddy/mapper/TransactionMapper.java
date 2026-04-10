package com.budgetbuddy.mapper;

import com.budgetbuddy.dto.TransactionDTO;
import com.budgetbuddy.model.Transaction;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TransactionMapper {

    TransactionDTO toDTO(Transaction transaction);

    List<TransactionDTO> toDTOList(List<Transaction> transactions);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Transaction toEntity(TransactionDTO transactionDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDTO(TransactionDTO dto, @MappingTarget Transaction transaction);
}
