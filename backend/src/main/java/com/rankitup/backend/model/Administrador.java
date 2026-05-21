package com.rankitup.backend.model;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Administrador")
@Getter
@Setter
@NoArgsConstructor

public class Administrador extends Usuario {

}
