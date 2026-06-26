# CSTD Explicit Audio Design

## Goal

Keep decorative background music behind explicit user actions.

## Problem

- The homepage attempted to start BGM after preferences were ready.
- It also registered global pointer/key/touch activation listeners.
- Repeat visitors could trigger audio work through ordinary page interaction instead of the sound control or intro start.

## Decision

- Remove page-load BGM attempts and global activation listeners from the landing component.
- Keep intro sound and BGM start on the explicit intro start action.
- Make the sound control start BGM when audio is enabled but idle.
- Make the same control disable and stop BGM when it is already playing.

## Acceptance

- Component source no longer imports or calls the global activation listener.
- Idle audio state says `奶油音乐待播放`.
- Browser load does not construct audio before the sound button is clicked.
- Clicking the sound control constructs and starts the BGM asset.
