package com.budgetbuddy.mapper;

import com.budgetbuddy.dto.TransactionDTO;
import com.budgetbuddy.model.Transaction;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-07T10:23:32+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class TransactionMapperImpl implements TransactionMapper {

    @Override
    public TransactionDTO toDTO(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }

        TransactionDTO.TransactionDTOBuilder transactionDTO = TransactionDTO.builder();

        transactionDTO.amount( transaction.getAmount() );
        transactionDTO.category( transaction.getCategory() );
        transactionDTO.createdAt( transaction.getCreatedAt() );
        transactionDTO.description( transaction.getDescription() );
        transactionDTO.id( transaction.getId() );
        transactionDTO.title( transaction.getTitle() );
        transactionDTO.transactionDate( transaction.getTransactionDate() );
        transactionDTO.type( transaction.getType() );
        transactionDTO.updatedAt( transaction.getUpdatedAt() );

        return transactionDTO.build();
    }

    @Override
    public List<TransactionDTO> toDTOList(List<Transaction> transactions) {
        if ( transactions == null ) {
            return null;
        }

        List<TransactionDTO> list = new ArrayList<TransactionDTO>( transactions.size() );
        for ( Transaction transaction : transactions ) {
            list.add( toDTO( transaction ) );
        }

        return list;
    }

    @Override
    public Transaction toEntity(TransactionDTO transactionDTO) {
        if ( transactionDTO == null ) {
            return null;
        }

        Transaction.TransactionBuilder transaction = Transaction.builder();

        transaction.amount( transactionDTO.getAmount() );
        transaction.category( transactionDTO.getCategory() );
        transaction.description( transactionDTO.getDescription() );
        transaction.title( transactionDTO.getTitle() );
        transaction.transactionDate( transactionDTO.getTransactionDate() );
        transaction.type( transactionDTO.getType() );

        return transaction.build();
    }

    @Override
    public void updateEntityFromDTO(TransactionDTO dto, Transaction transaction) {
        if ( dto == null ) {
            return;
        }

        transaction.setAmount( dto.getAmount() );
        transaction.setCategory( dto.getCategory() );
        transaction.setDescription( dto.getDescription() );
        transaction.setTitle( dto.getTitle() );
        transaction.setTransactionDate( dto.getTransactionDate() );
        transaction.setType( dto.getType() );
    }
}
