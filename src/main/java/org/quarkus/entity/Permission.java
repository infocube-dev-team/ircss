package org.quarkus.entity;


import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter @Setter
public class Permission {
    private String resource;
    private Boolean create;
    private Boolean read;
    private Boolean update;
    private Boolean search;
    private Boolean history;
    private Boolean delete;
}
